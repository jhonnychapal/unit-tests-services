import { TestBed } from '@angular/core/testing';

import { ProductsService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { generateOneProduct, generateManyProducts } from '../models/product.mock';
import { environment } from 'src/environments/environment';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductsService', () => {
    let productService: ProductsService;
    let httpTestingController: HttpTestingController;
    let tokenService: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                ProductsService,
                TokenService,
                {
                    provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
                  }
            ]
        });
        productService = TestBed.inject(ProductsService);
        httpTestingController = TestBed.inject(HttpTestingController);;
        tokenService = TestBed.inject(TokenService);
    });

    afterEach(() => {
        httpTestingController.verify();
    })

    it('should be create', () => {
        expect(productService).toBeTruthy();
    });

    describe('tests for getAllSimple', () => {
        it('return a product list',(doneFn) => {
            // Arrange
            const mockData: Product[] = generateManyProducts(2);
            // Act
            productService.getAllSimple()
            .subscribe((data) => {
                // Assert
                expect(data.length).toEqual(mockData.length)
                expect(data).toEqual(mockData)
                doneFn();
            });

            // http config
            const url = `${environment.API_URL}/api/v1/products`;
            const req = httpTestingController.expectOne(url);
            req.flush(mockData);
        })
    });

    describe('tests for getAllSimple with interceptor', () => {
        it('return a product list',(doneFn) => {
            // Arrange
            const mockData: Product[] = generateManyProducts(2);
            spyOn(tokenService, 'getToken').and.returnValue('123');
            // Act
            productService.getAllSimple()
            .subscribe((data) => {
                // Assert
                expect(data.length).toEqual(mockData.length)
                expect(data).toEqual(mockData)
                doneFn();
            });

            // http config
            const url = `${environment.API_URL}/api/v1/products`;
            const req = httpTestingController.expectOne(url);
            const headers = req.request.headers;
            expect(headers.get('Authorization')).toEqual('Bearer 123')
            req.flush(mockData);
        })
    });

    describe('tests for getAll', () => {
        it('return a product list',(doneFn) => {
            // Arrange
            const mockData: Product[] = generateManyProducts(3);
            // Act
            productService.getAll()
            .subscribe((data) => {
                // Assert
                expect(data.length).toEqual(mockData.length)
                doneFn();
            });

            // http config
            const url = `${environment.API_URL}/api/v1/products`;
            const req = httpTestingController.expectOne(url);
            req.flush(mockData);
        });

        it('should return product list with taxes', (doneFn) => {
            // Arrange
            const mockData: Product[] = [
                {
                    ...generateOneProduct(),
                    price: 100, // 100 * .19 = 19
                },
                {
                    ...generateOneProduct(),
                    price: 200, // 200 * .19 = 38
                },
                {
                    ...generateOneProduct(),
                    price: 0, // 0 * .19 = 0
                },
                {
                    ...generateOneProduct(),
                    price: -20, // = 0
                },
            ]

            // Act
            productService.getAll()
            .subscribe((data) => {
                // Assert
                expect(data.length).toEqual(mockData.length)
                expect(data[0].taxes).toEqual(19)
                expect(data[1].taxes).toEqual(38)
                expect(data[2].taxes).toEqual(0)
                expect(data[3].taxes).toEqual(0)

                doneFn();
            });

            // http config
            const url = `${environment.API_URL}/api/v1/products`;
            const req = httpTestingController.expectOne(url);
            req.flush(mockData);

        });

        it('should send query params with limit 10 and offset 3',(doneFn) => {
            // Arrange
            const mockData: Product[] = generateManyProducts(3);
            const limit = 10;
            const offset = 3;
            // Act
            productService.getAll(limit, offset)
            .subscribe((data) => {
                // Assert
                expect(data.length).toEqual(mockData.length)
                doneFn();
            });

            // http config
            const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
            const req = httpTestingController.expectOne(url);
            req.flush(mockData);
            const params = req.request.params;
            expect(params.get('limit')).toEqual(`${limit}`);
            expect(params.get('offset')).toEqual(`${offset}`);
        });
    });

    describe('tests for create', () => {
        it('should return a new product', (doneFn) => {
            // Arrange
            const mockData = generateOneProduct();
            const dto: CreateProductDTO = {
                title: 'new product',
                price: 100,
                images: ['img'],
                description: 'blablabla',
                categoryId: 123
            }
            // Act
            productService.create({...dto})
            .subscribe((data) => {
                // Assert
                expect(data).toEqual(mockData)
                doneFn();

            });
            // http config
            const url = `${environment.API_URL}/api/v1/products`;
            const req = httpTestingController.expectOne(url);
            req.flush(mockData);
            expect(req.request.body).toEqual(dto)
            expect(req.request.method).toEqual('POST')
            
        })
    });

    describe('tests for update', () => {
        it('should update a product', (doneFn) => {
            // Arrange
            const mockData = generateOneProduct();
            const dto: UpdateProductDTO = {
                title: 'act product'
            }

            const productId = '1';
            // Act
            productService.update(productId, {...dto})
            .subscribe((data) => {
                // Assert
                expect(data).toEqual(mockData)
                doneFn();
            });
            // http config
            const url = `${environment.API_URL}/api/v1/products/${productId}`;
            const req = httpTestingController.expectOne(url);
            expect(req.request.method).toEqual('PUT')
            expect(req.request.body).toEqual(dto)
            req.flush(mockData);
        })
    });

    describe('tests for delete', () => {
        it('should delete a product', (doneFn) => {
            // Arrange
            const mockData = true;
            const productId = '1';
            // Act
            productService.delete(productId)
            .subscribe((data) => {
                // Assert
                expect(data).toEqual(mockData)
                doneFn();
            });
            // http config
            const url = `${environment.API_URL}/api/v1/products/${productId}`;
            const req = httpTestingController.expectOne(url);
            expect(req.request.method).toEqual('DELETE')
            req.flush(mockData);
        })
    });

    describe('tests for getOne', () => {
        it('should return a product', (doneFn) => {
            // Arrange
            const mockData = generateOneProduct();
            const productId = '1';
            // Act
            productService.getOne(productId)
            .subscribe((data) => {
                // Assert
                expect(data).toEqual(mockData)
                doneFn();
            });
            // http config
            const url = `${environment.API_URL}/api/v1/products/${productId}`;
            const req = httpTestingController.expectOne(url);
            expect(req.request.method).toEqual('GET')
            req.flush(mockData);
        });

        it('should return the rigth message when status code is 404 (camino NO feliz)', (doneFn) => {
            // Arrange
            // no necesitamos el mock del producto, porque no se va a retornar algun producto
            const productId = '1';
            const msgError = '404 message'
            const mockError = {
                status: HttpStatusCode.NotFound,
                statusText: msgError
            }
            // Act
            productService.getOne(productId)
            .subscribe({
                error: (error) => {  // para versiones de rxjs <= 7.5
                    // Assert
                    expect(error).toEqual('El producto no existe')
                    doneFn()
                }
            });

            // Para versiones menores de rxjs
            // .susbcribe(null, (error) => {
            //     // Assert
            //     expect(error).toEqual('El producto no existe')
            //     doneFn()
            // });

            // http config
            const url = `${environment.API_URL}/api/v1/products/${productId}`;
            const req = httpTestingController.expectOne(url);
            expect(req.request.method).toEqual('GET')
            req.flush(msgError, mockError);
        })
    });
});