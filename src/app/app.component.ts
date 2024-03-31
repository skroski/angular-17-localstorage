import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  template: `
    <div class="container">
      <div class="row pt-3">
        <div class="col-6">
          <h4>Estudantes</h4>
        </div>
        <div class="col-6 text-end">
        <button class="btn btn-outline-success" (click)="openModal()">Novo Estudante</button>
        </div>
      </div>
      @if (studentList.length !== 0) {
      <div class="row">
        @for (student of studentList; track student.id) {
          <div class="col-3">
          <div class="card">
          <div class="card-header">
            <div class="row">
              <div class="col-6">
                {{ student.name }}
              </div>
              <div class="col-6 text-end">
                {{student.mobileNo}}
              </div>
            </div>
          </div>
            <div class="card-body">
              <p>{{ student.email }}</p>
              <p>{{ student.email }} - {{ student.state}} - {{ student.pincode }}</p>
              <p>{{ student.address }}</p>
            </div>
            <div class="card-footer text-center">
          <div class="row">
            <div class="col-6">
             <small>{{student.email}}</small> 
            </div>
            <div class="col-6">
              <button class="btn btn-sm btn-primary" (click)="onEdit(student)">Editar</button>
              <button class="btn btn-sm btn-danger" (click)="onDelete(student)">Deletar</button>
            </div>
          </div>

        </div>
      
          </div>
           </div>
        }
      </div> 
      }
      @else { 
    <div class="row">
      <div class="col-12 p-4 text-center">
        <p>Não existe registros cadastrados. Cria um estudante novo!</p>
      </div>
    </div>
  }

      <div class="row">
        <div class="modal" id="myModal" #myModal>
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Criar novo estudante</h4>
                <button type="button" class="btn-close" (click)="closeModal()" ></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-8">
                    <label for="">Nome</label>
                    <input type="text" class="form-control" [(ngModel)]="studentObj.name" placeholder="Name">
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <label for="">Celular</label>
                    <input type="text" class="form-control" [(ngModel)]="studentObj.mobileNo" placeholder="Mobile">
                  </div>
                  <div class="col-6">
                    <label for="">E-mail</label>
                    <input type="text" class="form-control" [(ngModel)]="studentObj.email" placeholder="Email">
                  </div>
                </div>
                <div class="row">
                  <div class="col-4">
                    <label for="">Cidade</label>
                    <input type="text"  class="form-control" [(ngModel)]="studentObj.city" placeholder="City">
                  </div>
                  <div class="col-4">
                    <label for="">Estado</label>
                    <input type="text" class="form-control" [(ngModel)]="studentObj.state" placeholder="State">
                  </div>
                  <div class="col-4">
                    <label for="">CEP</label>
                    <input type="text" class="form-control" [(ngModel)]="studentObj.pincode" placeholder="Pin Code">
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <label for="">Endereço</label>
                    <textarea rows="3" class="form-control" [(ngModel)]="studentObj.address"></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" (click)="closeModal()">Fechar</button>
                @if (studentObj.id ==0) {
                  <button type="button" class="btn btn-primary" (click)="saveStudent()">Criar Estudante</button>
                } @else {
                  <button type="button" class="btn btn-success" (click)="updateStudent()">Atualizar Estudante</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-outlet />
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'angular-17-localstorage';
  studentObj: Student = new Student();
  studentList: Student[] = [];
  @ViewChild('myModal') modal: ElementRef | undefined;

  ngOnInit(): void {
    const localData = localStorage.getItem("Angular17");
    if (localData != null) {
      this.studentList = JSON.parse(localData);
    }


  }
  openModal() {
    const modal = document.getElementById("myModal");
    if (modal != null) {
      modal.style.display = 'block'
    }
  }

  closeModal() {
    this.studentObj = new Student();
    if (this.modal != null) {
      this.modal.nativeElement.style.display = 'none';
    }

  }
  saveStudent() {
    //debugger;
    const isLocalPresent = localStorage.getItem("Angular17");
    if (isLocalPresent != null) {
      const oldArray = JSON.parse(isLocalPresent);
      this.studentObj.id = oldArray.length + 1;
      oldArray.push(this.studentObj);
      this.studentList = oldArray;
      localStorage.setItem('Angular17', JSON.stringify(oldArray))

    } else {
      const newArr = [];
      newArr.push(this.studentObj);
      this.studentObj.id = 1;
      this.studentList = newArr;
      localStorage.setItem('Angular17', JSON.stringify(newArr))

    }
    this.closeModal()
  }
  updateStudent() {
    const currentRecord = this.studentList.find(m => m.id === this.studentObj.id);
    if (currentRecord != undefined) {
      currentRecord.name = this.studentObj.name;
      currentRecord.address = this.studentObj.address;
      currentRecord.mobileNo = this.studentObj.mobileNo;
    };
    localStorage.setItem('angular17crud', JSON.stringify(this.studentList));
    this.closeModal()
  }
  onEdit(student: Student) {
    //debugger;
    this.studentObj = student;

    this.openModal();
  }
  onDelete(student: Student) {
    const isDelet = confirm("Tem certeza que deseja deletar?");
    if(isDelet) {
      const currentRecord =  this.studentList.findIndex(m=> m.id === this.studentObj.id);
      this.studentList.splice(currentRecord,1);
      localStorage.setItem('angular17crud', JSON.stringify(this.studentList));
    }
  }

}
export class Student {
  id: number;
  name: string;
  mobileNo: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  address: string;

  constructor() {
    this.id = 0;
    this.address = '';
    this.city = '';
    this.email = '';
    this.mobileNo = '';
    this.name = '';
    this.state = '';
    this.pincode = '';
  }

}
