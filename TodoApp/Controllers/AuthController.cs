using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Models;
using TodoApp.ViewModels;

namespace TodoApp.Controllers.User
{
    public class AuthController : Controller
    {
        private UserManager<TodoUser> _userManager;
        private SignInManager<TodoUser> _signInManager;
        private ILogger _logger;

        public AuthController(UserManager<TodoUser> userManager, SignInManager<TodoUser> signInManager, ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        public IActionResult Signup()
        {
            return View();
        }

        public IActionResult Login()
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Todo", "Home");
            }
            
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Signup (AuthViewModel userData)
        {
            if (ModelState.IsValid)
            {
                var user = new TodoUser
                {
                    Email = userData.Email,
                    UserName = userData.Email
                };
                
                var signupResult = await _userManager.CreateAsync(user, userData.Password);

                if (signupResult.Succeeded)
                {
                    var signInResult = await _signInManager.PasswordSignInAsync(user.UserName, userData.Password, true, false);

                    if (signInResult.Succeeded)
                    {
                        return RedirectToAction("Todo", "Home");
                    }
                }
                else
                {
                    _logger.LogError("Failed to create user");
                    ModelState.AddModelError("", "Failed to sign up");
                }
            }
            
            _logger.LogError("Failed to create user and sign up");

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login (AuthViewModel userData, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                var signInResult = await _signInManager.PasswordSignInAsync(userData.Email, userData.Password, true, false);

                if (signInResult.Succeeded)
                {
                    if (string.IsNullOrWhiteSpace(returnUrl))
                    {
                        return RedirectToAction("Todo", "Home");
                    }
                    else
                    {
                        return Redirect(returnUrl);
                    }                    
                }
                else
                {
                    _logger.LogError("Failed to sign user in");
                    ModelState.AddModelError("", "Email or password incorrect");
                }
            }

            _logger.LogError("Failed to create user and sign up");

            return View();
        }

        public async Task<ActionResult> Logout()
        {
            if (User.Identity.IsAuthenticated)
            {
                await _signInManager.SignOutAsync();
            }

            return RedirectToAction("Index", "Home");
        }
    }
}
