import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  onLogin() {
    this.isLoading = true;
    this.registrationService.login();
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, 1500);
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    if (this.isLogin) {
      // Send a request to login servers
    } else {
      // Send a request to signup servers
    }
  }
}

