/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Inject, Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { Lecturer } from '../../shared/models/lecturer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../tokens/api-url.token';
import { SortColumn, SortDirection } from '../directives/sortable-lecturers.directive';
import { LowerCasePipe } from '@angular/common';
import { AppLocalStorage } from './app-local-storage.service';

interface SearchResult {
  lecturers: Lecturer[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(lecturers: Lecturer[], column: SortColumn, direction: string): Lecturer[] {
  if (direction === '' || column === '') {
    return lecturers;
  } else {
    return [...lecturers].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(lecturer: Lecturer, term: string, pipe: PipeTransform) {
  return (
    lecturer.firstName.toLowerCase().includes(term.toLowerCase()) ||
    pipe.transform(lecturer.surname).includes(term) ||
    pipe.transform(lecturer.email).includes(term) ||
    pipe.transform(lecturer.academicDegree).includes(term)
  );
}

@Injectable({
  providedIn: 'root',
})
export class LecturerService {
  public rawLecturers: Lecturer[] = []; 

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _lecturers$ = new BehaviorSubject<Lecturer[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 25,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(
    private pipe: LowerCasePipe,
    private http: HttpClient,
    private appLocalStorage: AppLocalStorage,
    @Inject(API_URL) private apiUrl: string,
  ) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false)),
      )
      .subscribe((result) => {
        this._lecturers$.next(result.lecturers);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get lecturers$() { return this._lecturers$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this.set({ page }); }
  set pageSize(pageSize: number) { this.set({ pageSize }); }
  set searchTerm(searchTerm: string) { this.set({ searchTerm }); }
  set sortColumn(sortColumn: SortColumn) { this.set({ sortColumn }); }
  set sortDirection(sortDirection: SortDirection) { this.set({ sortDirection }); }

  private set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  public async updateLecturersList(): Promise<void> {
    this.rawLecturers = (await this.getLecturers())!;
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let lecturers = sort(this.rawLecturers, sortColumn, sortDirection);

    // 2. filter
    lecturers = lecturers.filter((lecturer) => matches(lecturer, searchTerm, this.pipe));
    const total = lecturers.length;

    // 3. paginate
    lecturers = lecturers.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ lecturers, total });
  }

  public async getLecturers(): Promise<Lecturer[] | undefined> {
    const url = `${this.apiUrl}/api/Lecturers`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.appLocalStorage.accessToken}`,
    });
    var result = this.http.get<Lecturer[]>(url, { headers }).toPromise();
    return result;
  }

  public async getLecturer(lecturerId: string): Promise<Lecturer | undefined> {
    const url = `${this.apiUrl}/api/Lecturers/${lecturerId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.appLocalStorage.accessToken}`,
    });
    var result = this.http.get<Lecturer>(url, { headers }).toPromise();
    return result;
  }

  public async createLecturer(lecturer: Lecturer): Promise<void> {
    const url = `${this.apiUrl}/api/Lecturers`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.appLocalStorage.accessToken}`,
    });
    var result = await this.http.post<void>(url, lecturer, { headers }).toPromise();
    return result;
  }

  public async updateLecturer(lecturer: Lecturer): Promise<void> {
    const url = `${this.apiUrl}/api/Lecturers`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.appLocalStorage.accessToken}`,
    });
    var result = await this.http.put<void>(url, lecturer, { headers }).toPromise();
    return result;
  }

  public async deleteLecturer(lecturerId: string): Promise<void> {
    const url = `${this.apiUrl}/api/Lecturers/${lecturerId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.appLocalStorage.accessToken}`,
    });
    var result = await this.http.delete<void>(url, { headers }).toPromise();
    return result;
  }
}
