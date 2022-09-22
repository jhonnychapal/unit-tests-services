import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
    let authService: AuthService;
    let httpTestingController: HttpTestingController;
    let tokenService: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                AuthService,
                TokenService
            ]
        });
        authService = TestBed.inject(AuthService);
        httpTestingController = TestBed.inject(HttpTestingController);;
        tokenService = TestBed.inject(TokenService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be create', () => {
        expect(authService).toBeTruthy();
    });

    describe('tests for login', () => {
        it('should retuen a token', (doneFn) => {
            // Arrange
            const mockData: Auth = {
                access_token: '123456'
            };
            const email = "email@email.com"
            const password = "1234"
            // Act
            authService.login(email, password)
            .subscribe((data) => {
                // Assert
                expect(data).toEqual(mockData)
                doneFn();
            });

            // http config
            const url = `${environment.API_URL}/api/v1/auth/login`;
            const req = httpTestingController.expectOne(url);
            req.flush(mockData);
        });

        it('should call to saveToken', (doneFn) => {
            // Arrange
            const mockData: Auth = {
                access_token: '123456'
            };
            const email = "email@email.com"
            const password = "1234";
            spyOn(tokenService, 'saveToken').and.callThrough();
            // Act
            authService.login(email, password)
            .subscribe((data) => {
                // Assert
                expect(data).toEqual(mockData)
                expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
                expect(tokenService.saveToken).toHaveBeenCalledOnceWith('123456');
                doneFn();
            });

            // http config
            const url = `${environment.API_URL}/api/v1/auth/login`;
            const req = httpTestingController.expectOne(url);
            req.flush(mockData);
        });
    });
});


