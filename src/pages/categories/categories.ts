import { Component, OnInit } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
// import * as _ from 'lodash';

@Component({
	selector: 'page-categories',
	templateUrl: 'categories.html'
})
export class CategoriesFilterPage implements OnInit {
	private categories: Array<any>;
	private title: string;
	private page: any;
	// _: any = _;

	constructor(public viewCtrl: ViewController,
		private navCtrl: NavController,
		private navParams: NavParams) { }

	ngOnInit(): void {
		if (this.navParams.data) {
			this.categories = this.navParams.data.categories;
			this.title = this.navParams.data.title;
			this.page = this.navParams.data.page;
		}
	}

	setFilter(category) {
		// this.viewCtrl.dismiss();
		console.log(category);
		this.navCtrl.popToRoot();
		this.navCtrl.push(this.page, {
			filter: `&category=${category.id}`,
			filterName: category.name
		});
	}
}
