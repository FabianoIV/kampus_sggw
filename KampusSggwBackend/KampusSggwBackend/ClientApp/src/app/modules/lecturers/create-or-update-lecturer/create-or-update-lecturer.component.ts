import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Lecturer } from '../../../shared/models/lecturer';
import { LecturerService } from '../../../core/services/lecturer.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'create-or-update-lecturer',
  templateUrl: './create-or-update-lecturer.component.html',
  styleUrls: ['./create-or-update-lecturer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateOrUpdateLecturerComponent implements OnInit {
  public editMode: boolean = false;
  public formLoading: boolean = false;
  private lecturerId?: string;
  private lecturer?: Lecturer;

  public otherAcademicDegreeName: string = 'Inny';
  public academicDegrees: string[] = [
    'prof. – profesor',
    'prof. SGGW - profesor SGGW',
    'dr hab. – doktor habilitowany',
    'dr – doktor',
    'mgr – magister',
    'inż. - inżynier',
    this.otherAcademicDegreeName
  ] 

  public form?: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public lecturerService: LecturerService
  ) { }

  public async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      if (params.lecturerId) {
        this.buildForm();
        this.lecturerId = params.lecturerId;
        this.lecturer = await this.lecturerService.getLecturer(this.lecturerId!);
        this.patchForm();
        this.editMode = true;
      } else {
        this.buildForm();
        this.editMode = false;
      }
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      id: [''],
      firstName: [''],
      surname: [''],
      email: [''],
      academicDegree: [this.academicDegrees[0]],
      otherAcademicDegree: ['']
    });
  }

  private patchForm(): void {
    this.form!.patchValue({
      id: this.lecturer!.id,
      firstName: this.lecturer!.firstName,
      surname: this.lecturer!.surname,
      email: this.lecturer!.email,
      academicDegree: this.academicDegrees.includes(this.lecturer!.academicDegree) ? this.lecturer!.academicDegree : this.otherAcademicDegreeName,
      otherAcademicDegree: !this.academicDegrees.includes(this.lecturer!.academicDegree) ? this.lecturer!.academicDegree : '',
    });
  }

  public async confirm(): Promise<void> {
    if (this.form!.invalid) {
      this.form!.markAllAsTouched();
      return;
    }

    this.lecturer = {
      id: this.form!.value['id'],
      firstName: this.form!.value['firstName'],
      surname: this.form!.value['surname'],
      email: this.form!.value['email'],
      academicDegree: this.form!.value['academicDegree'] != 'Inny' ? this.form!.value['academicDegree'] : this.form!.value['otherAcademicDegree'],
    };

    this.formLoading = true;

    if (this.editMode) {
      try {
        await this.lecturerService.updateLecturer(this.lecturer);
        this.toastr.success('Dane wykładowcy zostały pomyślnie zaktualizowane', 'Aktualizacja wykładowcy');
      } catch (e) {
        this.formLoading = false;
        throw e;
      }
    }
    else {
      try {
        await this.lecturerService.createLecturer(this.lecturer);
        this.toastr.success('Nowy wykładowca został utworzony', 'Tworzenie wykładowcy');
      } catch (e) {
        this.formLoading = false;
        throw e;
      }
    }

    await this.lecturerService.updateLecturersList();
    this.router.navigate(['/lecturers/list']);
    this.formLoading = false; 
  }
}
