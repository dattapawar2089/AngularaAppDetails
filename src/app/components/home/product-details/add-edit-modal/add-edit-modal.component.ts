import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductDataService } from 'src/app/services/product-data.service';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.scss']
})
export class AddEditModalComponent implements OnInit {

  prodDetailsForm: FormGroup
  cost_price: any;
  selling_price_error: boolean = false;
  loader = false;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;


  constructor( @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddEditModalComponent>,
  private productService: ProductDataService, private matDialog: MatDialog, private fb: FormBuilder) {  
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
      this.dialogRef.updateSize('60%');
      this.prodDetailsForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['',Validators.required],
        quantity: ['',Validators.required]
    });

    if(this.data.action === 'View/Edit'){
      this.setData();
    }
  }


  setData(){
    this.prodDetailsForm.patchValue({
      'name': this.data.formData.name,
      'description': this.data.formData.description,
      'price': this.data.formData.price,
      'quantity': this.data.formData.quantity
    })


  }


  updateProduct(): void {
    this.loader = true;
    this.productService.update(this.data.formData.id, this.prodDetailsForm.value)
      .subscribe(
        response => {
          console.log(response);
          this.loader = false;
          this.dialogRef.close();
        },
        error => {
          this.loader = false;
          console.log(error);
        });
  }


  saveProduct(): void {
    this.loader = true;
    

    this.productService.create(this.prodDetailsForm.value)
      .subscribe(
        response => {
          console.log(response);
          this.loader = false;
          this.dialogRef.close();
        },
        error => {
          this.loader = false;
          console.log(error);
        });
  }


  validateSellingPrice(){
    if(this.cost_price && this.prodDetailsForm.controls.selling_price.value && 
      this.prodDetailsForm.controls.selling_price.value < this.cost_price){
          this.selling_price_error = true;
    }else if(this.prodDetailsForm.controls.cost_price.value && this.prodDetailsForm.controls.selling_price.value && 
      this.prodDetailsForm.controls.selling_price.value < this.prodDetailsForm.controls.cost_price.value){
          this.selling_price_error = true;
    }else{
      this.selling_price_error = false;
    }
  }

  close(){
    this.dialogRef.close();
  }

}
