import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { Gender, IPerson, PersonDocumentType } from 'app/shared/model/person.model';
import { PersonService } from './person.service';
import { IUser, UserService } from 'app/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { IAddress } from 'app/shared/model/address.model';
import { Moment } from 'moment';
import { IPersonContact } from 'app/shared/model/person-contact.model';

@NgModule({
    imports: [
        // other imports ...
        ReactiveFormsModule
    ]
})
@Component({
    selector: 'jhi-person-update',
    templateUrl: './person-update.component.html'
})
export class PersonUpdateComponent implements OnInit {
    myForm: FormGroup;
    person: IPerson;
    isSaving: boolean;

    users: IUser[];
    birthdayDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected personService: PersonService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        // public id?: number,
        // public fullname?: string,
        // public documentNumber?: string,
        // public documentType?: PersonDocumentType,
        // public birthday?: Moment,
        // public gender?: Gender,
        // public userLogin?: string,
        // public userId?: number,
        // public addresses?: IAddress[],
        // public personContacts?: IPersonContact[]
        this.myForm = this.fb.group({
            id: [''],
            fullname: [''],
            documentNumber: [''],
            birthday: [''],
            gender: [''],
            userLogin: [''],
            userId: [''],
            addresss: [''],
            personContacts: ['']
        });
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ person }) => {
            this.person = person;
        });
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPerson>>) {
        result.subscribe((res: HttpResponse<IPerson>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected save() {
        console.log('attempt to save!');
        console.log(this.person);
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
