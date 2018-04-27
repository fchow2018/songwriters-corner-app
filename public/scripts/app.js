$("#btn_signup").on('click',function(){

  var data=$('#signup form').serialize();
  $.ajax({
    url:'/signup',
        method:'post',
      data:data,
    success:function(){window.location.href='/home'},
    error:function(json){
      $('.modal').modal('hide');
      console.log(json);
      $('#error').text(json.responseJSON.message.message);
    }
  });
});
$("#btn_login").on('click',function(){

  var data=$('#login form').serialize();
  $.ajax({
    url:'/login',
        method:'post',
      data:data,
    success:function(){window.location.href='/home'},
    error:function(json){
      $('.modal').modal('hide');
      console.log(json);
      $('#error').text('Wrong email and password');
    }
  });
});

export const registrationSchema = {

      "email": {

          notEmpty: true,

          isEmail: {

              errorMessage: "Invalid Email"

          }

      },

      "password": {

          notEmpty: true,

          isLength: {

              options: [{ min: 12}],

              errorMessage: "Must be at least 12 characters"

          },

          matches: {

              options: ["(?=.*[a-zA-Z])(?=.*[0-9]+).*", "g"],

              errorMessage: "Password must be alphanumeric."

          },

          errorMessage: "Invalid password"

      }

};
