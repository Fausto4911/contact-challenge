import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { Gender, IPerson, PersonDocumentType } from 'app/shared/model/person.model';
import { PersonService } from './person.service';
import { IUser, UserService } from 'app/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';

@Component({
    selector: 'jhi-person-update',
    templateUrl: './person-update.component.html'
})
export class PersonUpdateComponent implements OnInit {
    myForm = new FormGroup({
        id: new FormControl(),
        fullname: new FormControl(),
        documentNumber: new FormControl(),
        documentType: new FormControl(),
        birthday: new FormControl(),
        gender: new FormControl(),
        userLogin: new FormControl(),
        userId: new FormControl(),
        addresses: new FormControl(),
        personContacts: new FormControl()
    });
    person: IPerson;
    isSaving: boolean;
    users: IUser[];
    birthdayDp: any;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected personService: PersonService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute,
        protected http: HttpClient
    ) {}

    ngOnInit() {
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
        this.isSaving = true;
        this.fillPersonObjectFromForm();
        console.log(this.person);
        // if (this.person.id !== undefined) {
        //     this.subscribeToSaveResponse(this.personService.update(this.person));
        // } else {
        //     this.subscribeToSaveResponse(this.personService.create(this.person));
        // }
        this.subscribeToSaveResponse(this.personService.create(this.person));
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    private fillPersonObjectFromForm() {
        var dateString = this.myForm.value.birthday;
        var momentObj = moment(dateString, DATE_FORMAT);
        var docType = PersonDocumentType.PASSPORT;
        if (this.myForm.value.documentType == 0) docType = PersonDocumentType.ID;
        var gender = Gender.FEMALE;
        if (this.myForm.value.gender == 0) gender = Gender.MALE;

        this.person.id = this.myForm.value.id;
        this.person.fullname = this.myForm.value.fullname;
        this.person.documentNumber = this.myForm.value.documentNumber;
        this.person.documentType = docType;
        this.person.birthday = momentObj;
        this.person.gender = gender;
        this.person.userLogin = this.myForm.value.userLogin;
        this.person.userId = this.myForm.value.userId;
        this.person.addresses = this.myForm.value.addresses;
        this.person.personContacts = this.myForm.value.personContacts;
    }
}
