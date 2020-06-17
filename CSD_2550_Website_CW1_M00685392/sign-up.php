    <?php

    include ('common.php');

    outputHead("This is the sign-up page for the game Chrono-Spark","Login/Register");

    outputNavbar('Login/Register');

    ?>

    <!-- The header informs the user of what page they are on-->
    <header class="header">
        <h1>Sign in/up</h1>
    </header>
    <div class ="landing-2">
        <main>
            <div class="container d-flex h-100 align-items-center">
                <div class="mx-auto text-center">
                    <div class="row register">
                        <!-- The code below is responsible for the left side of the page which contains the floating oracle and buttons that allow switching from one pane to the other-->
                        <div class="col-md-3 register-left">
                            <img src="assets/img/sign-up/oracles_0.png" alt="A floating oracle"/>
                            <h3>Greetings Friend!</h3>
                            <p>Are you ready for the ultimate gaming experience?</p>
                            <ul class="nav nav-tabs nav-center" id="myTab" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="login-tab" data-toggle="tab" href="#login" role="tab" aria-controls="login" aria-selected="true">Login</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="register-tab" data-toggle="tab" href="#register" role="tab" aria-controls="register" aria-selected="false">Register</a>
                                </li>
                            </ul>
                        </div>
                        <!-- The code below is responsible for the login pane-->
                        <div class="col-md-9 register-right">
                            <div class="tab-content" id="myTabContent">
                                <div class="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="login-tab">
                                    <h3 id="login-text" class="register-heading">Please Login to continue playing</h3>
                                    <form id="remove-on-login" name="myLoginForm" action="sign-up.php" onsubmit= "return validateLogin()" method = "post">
                                        <div class="row register-form">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <input type="text" class="form-control" placeholder="User Name*" value="" name="user-login" />
                                                </div>
                                                <div class="form-group">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <input type="password" class="form-control"  placeholder="Password *" value="" name="user-login-password" />
                                                </div>
                                                <input type="submit" class="btnRegister" value="Login"/>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <!-- The code below is responsible for the register pane which may be tabbed to by pressing the register button on the left-->
                                <div class="tab-pane fade show" id="register" role="tabpanel" aria-labelledby="register-tab">
                                    <h3 class="register-heading">Sign up for an account</h3>
                                    <form name="myRegisterForm" action="sign-up.php" onsubmit= "return validateForm()" method = "post">
                                        <div class="row register-form">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <input type="text" name="user-name-register" class="form-control" placeholder="Requested User Name*" value="" />
                                                </div>
                                                <div class="form-group">
                                                    <input type="password" name="user-password-register" class="form-control" placeholder="Password *" value="" />
                                                </div>
                                                <div class="form-group">
                                                    <input type="password" name="confirm-password" class="form-control"  placeholder="Confirm Password *" value="" />
                                                </div>
                                                <!-- Radio buttons are declared-->
                                                <div class="form-group text-white">
                                                    <div class="maxl">
                                                        <label class="radio inline">
                                                            <input type="radio" name="age" value="Over 18" checked>
                                                            <span>Over 18</span>
                                                        </label>
                                                        <label class="radio inline">
                                                            <input type="radio" name="age" value="Under 18">
                                                            <span>Under 18</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <input type="email" name="user-email" class="form-control" placeholder="Your Email *" value="" />
                                                </div>
                                                <!-- Security Questions are declared-->
                                                <div class="form-group">
                                                    <select name="register-option" class="form-control">
                                                        <option class="hidden" value="blank" selected disabled>Please select a Security Question</option>
                                                        <option>Favourite sports team?</option>
                                                        <option>Your first crush?</option>
                                                        <option>First pet name?</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <input type="text" name="security-question-answer" class="form-control" placeholder="Enter Your Answer *" value="" />
                                                </div>
                                                <div class="checkbox text-white">
                                                    <label><input type="checkbox" name="checkbox-terms" value="checked"> I accept the <a class="terms" href=#>Terms & Conditions</a></label>
                                                </div>
                                                <input type="submit" class="btnRegister"  value="Register"/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <?php
    outputFooter('Login/Register');
    ?>
