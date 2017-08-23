import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Client } from '../../../_models/client';
import { ClientService } from '../../../_services/client.service';

export class Alert {
    active: boolean;
    title: string;
    message: string;
};

@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.css']
})
export class ClientsFormComponent implements OnInit {
  form: FormGroup;
  title: string;
  client: Client = new Client();

  imageFile : any;
  alert: Alert = { active: false, title: '', message: ''};

  constructor(
    formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService
  ) { 
    this.form = formBuilder.group({
      first_name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      last_name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: ['ddelgado@internovam.com', [        
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      trademark: [],
      img_trademark: [],
      phone: [],
      mobile_phone: []
    });
  }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.title = params.get('id') ? 'Edit User' : 'New User';
        return this.clientService.show(+params.get('id'))
      })
      .subscribe(data => {
          console.log(data);
          this.client = data;
      });
  }

  imagesPreview(event) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (_event:any) => {
            this.imageFile = {
                link: _event.target.result,
                file: event.srcElement.files[0],
                name: event.srcElement.files[0].name
            };            
        }

        reader.readAsDataURL(event.target.files[0]);
    }
  }

  save(): void {    
    document.querySelectorAll('[loadingBackdrop]')[0].classList.toggle('active');    
    this.clientService.create(this.getClientAsFormData(this.form.value))//this.form.value
      .subscribe(data => {        
        this.alert = {
          active: true,
          title: 'Client registered!',
          message: 'You successfully read this important alert message.'
        };
        document.querySelectorAll('[loadingBackdrop]')[0].classList.toggle('active');
      });
  }

  update(): void {
    document.querySelectorAll('[loadingBackdrop]')[0].classList.toggle('active');    
    
    let data = this.form.value;
    data.id = this.client.id;    
    this.clientService.update(this.form.value)
      .subscribe(data => {
        this.alert = {
          active: true,
          title: 'Client updated!',
          message: 'You successfully read this important alert message.'
        };
        document.querySelectorAll('[loadingBackdrop]')[0].classList.toggle('active');
      });
  }

  reset(): void {
    this.form.reset();    
    this.alert = { active: false, title: '', message: ''};
  }

  getClientAsFormData(_clienteFormGroup): FormData {
    let formData = new FormData();
    formData.append('img_trademark', this.imageFile.file);
    formData.append('first_name', _clienteFormGroup.first_name);
    formData.append('last_name', _clienteFormGroup.last_name);
    formData.append('email', _clienteFormGroup.email);
    formData.append('trademark', _clienteFormGroup.trademark);
    formData.append('img_trademark', _clienteFormGroup.img_trademark);
    formData.append('phone', _clienteFormGroup.phone);
    formData.append('mobile_phone', _clienteFormGroup.mobile_phone);
    return formData;
  }

}