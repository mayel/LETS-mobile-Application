import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../app/app.settings';
import { HttpBasicAuth } from './HttpBasicAuth';
import { Member } from '../domain/Member';
import { map } from 'lodash';

@Injectable()
export class MemberService {
	private pageSize: number = 20;

	constructor(private settings: AppSettings,
		private httpBasicAuth: HttpBasicAuth) { }

	list(page, filter = ''): Observable<Array<Member>> {
		let offset = this.pageSize * (page - 1);
		return this.httpBasicAuth.getWithAuth(`${this.settings.URL.members}?depth=1&offset=${offset}&limit=${this.pageSize}&sort=name,desc${filter}`)
			.map((response: Array<Member>) => {
				response = map(response, (member: Member, key: any) => {
					if (!member.id) {
						member.id = key;
					}
					return member;
				});
				return response;
			});
	}

	get(id): Observable<Member> {
		return this.httpBasicAuth.getWithAuth(`${this.settings.URL.members}/${id}?depth=1`);
	}

	post(member: Member): Observable<any> {
		return this.httpBasicAuth.postWithAuth(this.settings.URL.members, member);
	}

	patch(member: Member): Observable<any> {
		// console.log('patching member');
		// console.log(member);
		return this.httpBasicAuth.patchWithAuth(`${this.settings.URL.members}/${member.id}`, member);
	}

	describe(member: any = {}): Observable<any> {
		return this.httpBasicAuth.options(`${this.settings.URL.members}/${member.id}`);
	}

	custom(href): Observable<any> {
		return this.httpBasicAuth.putWithAuth(`${this.settings.URL.config}/${href}`, {});
	}

	contact(id, fields): Observable<any> {
		if(this.settings.URL.contact) var contact_url = `${this.settings.URL.contact}/${id}`;
		else var contact_url = `${this.settings.SERVER_URL}/contact/${id}`;
		return this.httpBasicAuth.postWithAuth(contact_url, fields);
	}
}
