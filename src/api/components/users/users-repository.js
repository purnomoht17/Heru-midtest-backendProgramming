const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 * @param {object} o - membuat objek baru untuk menyimpan page_number, page_size, sort, search
 */
async function getUsers(o = {}) {
  const {page_number=1, page_size=o.count, sort='name:asc', search=null} = o;

  let user = User.find();

  //logik untuk search
  if(search){
    const[v,k] = search.split(':');
    const reg = new RegExp(k,'i');
    user = user.where(v,{$regex: reg});
  }

  //logik untuk validasi dan sorting
  let[sort_v, sort_o] = sort.split(':');
  sort_o = sort_o.toLowerCase();
  if(!['asc','desc'].includes(sort_o)){
    sort_v='name';
    sort_o='asc';
  }

  user = user.sort({[sort_v]: sort_o});

  const totalData =  user.clone().countDocuments();
  const total = await totalData;

  const total_pages = Math.ceil(total/page_size);
  
  if(page_size){
    user = user.skip((page_number-1) * page_size).limit(page_size);
  }

  const data = await user;

  const has_previous_page = page_number > 1;
  const has_next_page = page_number < total_pages;

  return{
    page_number,
    page_size: page_size || total,
    total_pages,
    count: total,
    has_previous_page,
    has_next_page,
    data,
  }
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};