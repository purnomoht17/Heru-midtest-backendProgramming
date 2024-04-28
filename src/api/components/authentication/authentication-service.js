const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');

const upayaGagal = {};  //menyimpan catatan upaya login yang gagal
let waktuCobaLagi = 30*60*1000  //30 menit dalam millidetik
const max = 2 //batas maksimal upaya gagal

//mengurangi satu menit dari waktu coba lagi setiap menit
setInterval(() => {
  waktuCobaLagi -= 60000;
}, 60000);

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  function gagal_login(email){
    const currentTime = new Date().getTime();

    if(!upayaGagal[email]){
      upayaGagal[email] = {
        upaya: 1,
        timestamp: currentTime
      }
    }else{
      // Periksa apakah waktu coba lagi sudah lewat
      if(currentTime - upayaGagal[email].timestamp >= waktuCobaLagi){
        // Reset upaya login yang gagal dan perbarui timestamp
        upayaGagal[email].upaya = 1;
        upayaGagal[email].timestamp = currentTime;
      } else{
        upayaGagal[email].upaya++;
      }
    } 

    if(upayaGagal[email].upaya >= max){
      return  true;
    }

    return false;
  }

  // Periksa apakah email telah mencapai batas upaya login yang gagal
  //akan muncul pesan try again in (berapa menit lagi, akan kurang satu menit per menit) menggunakan setInterval
  if(gagal_login(email)){
    const remaining = Math.ceil(waktuCobaLagi / (1000*60));
    throw errorResponder(
      errorTypes.FORBIDDEN,
      `Too many failed login attempt. Try again in ${remaining} minuters`
    )
  }

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
