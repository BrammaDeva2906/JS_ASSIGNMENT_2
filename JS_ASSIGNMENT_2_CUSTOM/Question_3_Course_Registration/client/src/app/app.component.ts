import {Component,OnInit} from '@angular/core';import {CommonModule} from '@angular/common';import {FormBuilder,ReactiveFormsModule,Validators} from '@angular/forms';import {HttpClient} from '@angular/common/http';
interface Registration{_id:string;studentName:string;studentId:string;email:string;courseCode:string;courseName:string;semester:string}
@Component({selector:'app-root',standalone:true,imports:[CommonModule,ReactiveFormsModule],templateUrl:'./app.component.html'})
export class AppComponent implements OnInit{
 private api='http://localhost:5002/api/records'; registrations:Registration[]=[]; message=''; selected='CS402';
 courses=[{code:'CS402',name:'Cloud Computing',seats:30,used:18,tag:'SYSTEMS',tone:'blue'},{code:'CS415',name:'Machine Learning',seats:25,used:21,tag:'INTELLIGENCE',tone:'violet'},{code:'CS330',name:'User Experience Design',seats:35,used:12,tag:'DESIGN',tone:'orange'},{code:'CS421',name:'Cyber Security',seats:20,used:20,tag:'SECURITY',tone:'green'}];
 form=this.fb.group({studentName:['',[Validators.required,Validators.minLength(3)]],studentId:['',[Validators.required,Validators.pattern(/^[0-9]{2}[A-Z]{2,4}[0-9]{2,4}$/i)]],email:['',[Validators.required,Validators.email]],courseCode:['CS402',Validators.required],semester:['V',Validators.required]});
 constructor(private fb:FormBuilder,private http:HttpClient){} ngOnInit(){this.load();}
 load(){this.http.get<Registration[]>(this.api).subscribe({next:r=>this.registrations=r,error:()=>this.message='Start the course API on port 5002.'});}
 get selectedCourse(){return this.courses.find(c=>c.code===this.form.value.courseCode)||this.courses[0];}
 get available(){return this.selectedCourse.seats-this.selectedCourse.used;}
 choose(code:string){this.form.patchValue({courseCode:code});this.selected=code;}
 register(){if(this.form.invalid){this.form.markAllAsTouched();return;}const c=this.selectedCourse;if(c.used>=c.seats){this.message='This course is full. Choose another course.';return;}const v=this.form.getRawValue();const body={...v,courseName:c.name};this.http.post<Registration>(this.api,body).subscribe({next:r=>{this.registrations=[r,...this.registrations];c.used++;this.form.patchValue({studentName:'',studentId:'',email:''});this.form.markAsPristine();this.message='Registration confirmed. Your seat is reserved.';},error:e=>this.message=e.error?.message||'Could not register. Try again.'});}
 cancel(r:Registration){if(!confirm(`Cancel ${r.courseName} for ${r.studentName}?`))return;this.http.delete(`${this.api}/${r._id}`).subscribe({next:()=>{this.registrations=this.registrations.filter(x=>x._id!==r._id);const c=this.courses.find(x=>x.code===r.courseCode);if(c)c.used=Math.max(0,c.used-1);this.message='Registration cancelled.';},error:()=>this.message='Could not cancel registration.'});}
}
