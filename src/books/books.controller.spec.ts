import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

const mockBook = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  publicationDate: '2023-01-01',
  genre: 'Test Genre',
};

const mockBooksService = {
  createBook: jest.fn().mockResolvedValue(mockBook),
  findAll: jest.fn().mockResolvedValue([mockBook]),
  findOne: jest.fn().mockResolvedValue(mockBook),
  update: jest.fn().mockResolvedValue(mockBook),
  remove: jest.fn().mockResolvedValue(true),
};

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should create a book', async () => {
    const book = await controller.create(mockBook);
    expect(service.createBook).toHaveBeenCalledWith(mockBook);
    expect(book).toEqual(mockBook);
  });

  it('should find all books', async () => {
    const books = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(books).toEqual([mockBook]);
  });

  it('should find one book by ID', async () => {
    const book = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(book).toEqual(mockBook);
  });

  it('should delete a book by ID', async () => {
    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });
});
