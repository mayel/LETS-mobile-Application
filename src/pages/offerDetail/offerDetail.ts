import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController, NavController, LoadingController, Loading, PopoverController, Popover } from 'ionic-angular';
import { OfferService } from '../../services/OfferService';
import { AlertService } from '../../services/AlertService';
import { MemberDetailPage } from '../memberDetail/memberDetail';
import { Offer } from '../../domain/Offer';
import { map } from 'lodash';
import { MoreActionsBuilderComponent } from '../../components/moreActionsBuilder/moreActionsBuilder';
import { AuthService } from '../../services/AuthService';
import { Member } from '../../domain/Member';
import { AddOfferPage } from '../addOffer/addOffer';
import { ConfirmationBuilderComponent } from '../../components/confirmationBuilder/confirmationBuilder';

@Component({
	selector: 'page-offer-detail',
	templateUrl: 'offerDetail.html'
})
export class OfferDetailPage implements OnInit {
	private definitionOffer: any;
	private offer: Offer;
	private loader: Loading
	private imageExpanded: boolean;
	private popover: Popover;
	private currentMember: Member;
	private currentUser: any;
	private deleteOfferConfirmDialog: boolean;

	constructor(private params: NavParams,
		private viewCtrl: ViewController,
		private navCtrl: NavController,
		public loadingCtrl: LoadingController,
		private popoverCtrl: PopoverController,
		private offerService: OfferService,
		private authService: AuthService,
		private alertService: AlertService) { }

	ngOnInit(): void {
		this.viewCtrl.didEnter.subscribe(
			response => {
				this.imageExpanded = false;
				this.loader = this.loadingCtrl.create({
					content: _('Please wait')+'...'
				});
				this.loader.present();

				this.authService.userInfo.subscribe(
					userInfo => {
						this.currentUser = userInfo.id;
						this.currentMember = userInfo;
						console.log(this.currentMember)
					});

				this.offerService.describe().subscribe(
					response => {
						this.definitionOffer = response;
						this.offerService.get(this.params.get('id')).subscribe(
							response => {
								for (let i in this.definitionOffer.POST) {
									let field = this.definitionOffer.POST[i];
									if (field.type === 'select') {
										if (field.multiple) {
											response[`$${i}`] = map(response[i], (option: any) => field.options[option]).join(', ');
										} else {
											response[`$${i}`] = field.options[response[i]];
										}
									}
								}
								this.offer = response;
								this.loader.dismiss();
							},
							error => {
								this.alertService.showError(error);
								this.loader.dismiss();
							});
					},
					error => {
						this.alertService.showError(error);
						this.loader.dismiss();
					});
			});
	}

	showMember(userId) {
		this.navCtrl.push(MemberDetailPage, {
			id: userId
		});
	}

	expandImage() {
		this.imageExpanded = !this.imageExpanded;
	}

	showActions() {
		this.popover = this.popoverCtrl.create(MoreActionsBuilderComponent, {
			operation: _('Offer'),
			status: 'Menu',
			options: []
		}, {
				cssClass: 'confirm-popover',
				enableBackdropDismiss: true
			});
		this.popover.present();
	}

	editOffer(offer: Offer) {
		this.navCtrl.push(AddOfferPage, {
			offer: offer
		});
	}


	deleteOffer(id) {
		this.popover = this.popoverCtrl.create(ConfirmationBuilderComponent, {
			fields: this.definitionOffer.POST,
			operation: _('Delete Offer')
		}, {
				cssClass: 'confirm-popover',
				enableBackdropDismiss: false
			});
		this.deleteOfferConfirmDialog = true;
		this.popover.onDidDismiss((data) => {
			this.deleteOfferConfirmDialog = false;
			if (data && data.hasConfirmed) {
				this.loader = this.loadingCtrl.create({
					content: _('Please wait')+'...'
				});
				this.loader.present();
				this.offerService.delete(id).subscribe(
					response => {
						this.loader.dismiss();
						// this.initPage();
					},
					error => {
						this.alertService.showError(error);
						this.loader.dismiss();
					});
			}
		});
		this.popover.present();
	}

	customAction(label: String, href: String, confirm: String) {
		console.log(label, href, confirm);
		this.popover = this.popoverCtrl.create(ConfirmationBuilderComponent, {
			operation: label
		}, {
				cssClass: 'confirm-popover',
				enableBackdropDismiss: false
			});
		this.deleteOfferConfirmDialog = true;
		this.popover.onDidDismiss((data) => {
			this.deleteOfferConfirmDialog = false;
			if (data && data.hasConfirmed) {
				this.loader = this.loadingCtrl.create({
					content: _('Please wait')+'...'
				});
				this.loader.present();
				this.offerService.custom(href).subscribe(
					response => {
						this.loader.dismiss();
						// this.initPage();
					},
					error => {
						this.alertService.showError(error);
						this.loader.dismiss();
					});
			}
		});
		this.popover.present();
	}

}
