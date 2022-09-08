import { StudentService } from './../student.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/ui-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student= {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  };
  genderList: Gender[] = [];

  constructor(private readonly studentService: StudentService,
    private readonly genderService: GenderService,
    private readonly route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId) {
          this.studentService.getStudent(this.studentId)
            .subscribe(
              (successResponse) => {
                // console.log(successResponse)
                this.student = successResponse;
              }
            );
        }
        this.genderService.getGenderList()
        .subscribe(
          (successResponse) => {
            // console.log(successResponse)
            this.genderList = successResponse;
          }
        );
      }
    );
  }
  onUpdate(): void {
    // console.log(this.student)
    this.studentService.updateStudent(this.student.id, this.student)
      .subscribe(
        (successResponse) => {
          console.log(successResponse);
          // Show a notification
          this.snackbar.open('Student updated successfully', undefined, {
            duration: 2000
          });
        },
        (errorResponse) => {
          // Log it
        }
      );
  }

  onDelete(): void {
    this.studentService.deleteStudent(this.student.id)
      .subscribe(
        (successResponse) => {
          console.log(this.student)
          this.snackbar.open('Student deleted successfully', undefined, {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl('students');
          }, 2000);
        },
        (errorResponse) => {
          // Log
        }
      );
  }
}
