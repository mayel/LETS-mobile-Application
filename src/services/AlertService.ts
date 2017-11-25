import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertService {

	constructor(
		private alertCtrl: AlertController
	) { }

	showError(message: any) {
		console.log('showError');
		console.error(message);

		var show = ( (message.error) ? message.error : (message) ? message : 'Unknown error' );

		return this.alertCtrl.create({
			title: 'Error!',
			subTitle: show,
			buttons: ['OK']
		}).present();
	}
}
