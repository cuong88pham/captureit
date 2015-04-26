myApp.controller('AuthCtrl', function ($scope, $sce, $location, $window, $routeParams, AuthFactory, UserFactory){
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
      // $location.path("/");
    })
    .error(function(err){
      console.log(err);
    });
  }
})
.controller('SignOutCtrl', function ($scope, $sce, $location, $window, $routeParams, AuthFactory, UserFactory){
  UserFactory.sign_out();
})
.controller('profileCtrl', ['$scope', '$window', 'AuthFactory', 'UserFactory', function($scope, $window, AuthFactory, UserFactory){
  UserFactory.me().success(function(user){
    console.log(user);
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
