import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { User, UserDto } from '../models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post a user', () => {
    const user: User = { username: 'john', password: '123', role: 'admin' };
    const userDto: UserDto = { username: 'john', role: 'admin' };

    service.postUser(user).subscribe((result) => {
      expect(result).toEqual(userDto);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush(userDto);
  });

  it('should get a user by id', () => {
    const userDto: UserDto = { username: 'john', role: 'admin' };

    service.getUserById(1).subscribe((result) => {
      expect(result).toEqual(userDto);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(userDto);
  });

  it('should delete a user by id', () => {
    service.deleteUserById(1).subscribe((result) => {
      expect(result).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
