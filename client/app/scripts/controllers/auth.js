myApp.controller('AuthCtrl', ['$scope','$location', '$window', '$routeParams', 'AuthFactory', 'UserFactory', function ($scope, $location, $window, $routeParams, AuthFactory, UserFactory){
  /* User sign in
    Request (application/json)
    {
      email: email@domain.com,
      password: your_password
    }
  */
  $scope.sign_in = function(email, password){
    if(email != '' || password !=''){
      UserFactory.sign_in(email, password)
      .success(function(user){
        setAuth(AuthFactory, user, $window);
        // $location.path("/");
      })
      .error(function(){
        alert('oops!!!');
      })
    }
  }

  /* User sign up
    Request (application/json)
    {
      username: yourname,
      email: email@domain.com,
      password: your_password
    }
  */
  $scope.sign_up = function(){
    console.log($scope.user);
    UserFactory.sign_up($scope.user)
    .success(function(user){
      setAuth(AuthFactory, user, $window);
    })
    .error(function(err){
      console.log(err);
    });
  }
}])
.controller('SignOutCtrl', ['$scope', 'UserFactory', function ($scope, UserFactory){
  UserFactory.sign_out();
}])
.controller('profileCtrl', ['$scope', 'UserFactory', function($scope, UserFactory){
  UserFactory.me().success(function(user){
    $scope.user = user;
  })
  .error(function(err){
    console.log(err);
  })
}])

function setAuth(AuthFactory, user, $window){
  AuthFactory.token = user.auth_token;
  AuthFactory.isLogin = true;
  AuthFactory.user = user;
  $window.localStorage.token = user.auth_token;
  $window.localStorage.user = user._id;
  $window.location.reload();
}
