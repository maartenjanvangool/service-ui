/*
 * Copyright 2017 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */
import Select from 'react-select';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';
import { fetch, addTokenToImagePath, validate } from 'common/utils';
import styles from './inputUserSearch.scss';
import { OptionsRender } from './optionsRender';

const cx = classNames.bind(styles);
const getPhoto = (userId) => {
  const d = new Date();
  return addTokenToImagePath(`../api/v1/data/userphoto?v=${d.getTime()}&id=${userId}`);
};
const isValidNewOption = ({ label }) => validate.email(label);
const newOptionCreator = option => ({ externalUser: true, label: option.label });
const promptTextCreator = label => (label);
const filterOption = (option, filter) =>
option.userName.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
option.userLogin.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
(option.email && option.email.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
const makeURL = (input, isAdmin, projectId) => {
  const apiVersion = '../api/v1/';
  const page = 1;
  const size = 10;
  const sort = '&page.sort=login,ASC';
  let search = '';
  let startUrl;
  if (!isAdmin) {
    startUrl = `${apiVersion}project/${projectId}/usernames/`;
  } else {
    startUrl = `${apiVersion}user/`;
  }
  if (input) {
    startUrl += 'search/';
    search = `&term=${input}`;
  } else {
    startUrl += 'all';
  }
  startUrl += `?page.page=${page}&page.size=${size}${sort}${search}`;
  return startUrl;
};
const makeOptions = (options, projectId) => options.map(option => ({
  userName: option.full_name || '',
  userLogin: option.userId,
  email: option.email,
  disabled: Object.prototype.hasOwnProperty.call(option.assigned_projects, projectId),
  isAssigned: Object.prototype.hasOwnProperty.call(option.assigned_projects, projectId),
  userAvatar: getPhoto(option.userId),
}));
const getUsers = (input, isAdmin, projectId) => {
  if (input) {
    const url = makeURL(input, isAdmin, projectId);
    return fetch(url)
      .then((response) => {
        const arr = makeOptions(response.content, projectId);
        return ({ options: arr });
      });
  }
  return Promise.resolve({ options: [] });
};

export const InputUserSearch = ({ isAdmin, onChange, projectId }) => (
  <Select.AsyncCreatable
    cache={false}
    className={cx('select2-search-users')}
    loadOptions={input => (getUsers(input, isAdmin, projectId))}
    filterOption={filterOption}
    loadingPlaceholder={<FormattedMessage id={'InputUserSearch.searching'} defaultMessage={'Searching...'} />}
    noResultsText={<FormattedMessage id={'InputUserSearch.noResults'} defaultMessage={'No matches found'} />}
    searchPromptText={<FormattedMessage id={'InputUserSearch.placeholder'} defaultMessage={'Please enter 1 or more character'} />}
    onChange={onChange}
    menuRenderer={({ focusOption, options, selectValue }) =>
      (OptionsRender({ focusOption, options, selectValue }))}
    isValidNewOption={isValidNewOption}
    newOptionCreator={newOptionCreator}
    promptTextCreator={promptTextCreator}
  />
);

InputUserSearch.propTypes = {
  isAdmin: PropTypes.bool,
  projectId: PropTypes.string,
  onChange: PropTypes.func,
};
InputUserSearch.defaultProps = {
  isAdmin: false,
  projectId: '',
  onChange: () => {},
};
