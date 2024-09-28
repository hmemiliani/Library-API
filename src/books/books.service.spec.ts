import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

const mockBook = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  publicationDate: '2023-01-01',
  genre: 'Test Genre',
};

const mockQueryBuilder = {
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockBook]),
};

const mockBooksRepository = {
  create: jest.fn().mockReturnValue(mockBook),
  save: jest.fn().mockResolvedValue(mockBook),
  find: jest.fn().mockResolvedValue([mockBook]),
  findOne: jest.fn().mockResolvedValue(mockBook),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBooksRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should create a new book', async () => {
    const book = await service.createBook(mockBook);
    expect(repository.create).toHaveBeenCalledWith(mockBook);
    expect(repository.save).toHaveBeenCalledWith(mockBook);
    expect(book).toEqual(mockBook);
  });

  it('should find all books', async () => {
    const books = await service.findAll({});
    expect(mockBooksRepository.createQueryBuilder).toHaveBeenCalled();
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    expect(books).toEqual([mockBook]);
  });
  

  it('should find one book by ID', async () => {
    const book = await service.findOne(1);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(book).toEqual(mockBook);
  });

  it('should delete a book by ID', async () => {
    const result = await service.remove(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });
});
