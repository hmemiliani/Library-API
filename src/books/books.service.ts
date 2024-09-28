import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>,
    ) {}

    async createBook(bookData: Partial<Book>): Promise<Book> {
        const newBook = this.booksRepository.create(bookData);
        return this.booksRepository.save(newBook);
    }

    async findAll(filters: { author?: string; genre?: string; publicationDate?: string; page?: number; limit?: number } = {}): Promise<Book[]> {
        const queryBuilder = this.booksRepository.createQueryBuilder('book');
      
        if (filters.author) {
          queryBuilder.andWhere('book.author = :author', { author: filters.author });
        }
        if (filters.genre) {
          queryBuilder.andWhere('book.genre = :genre', { genre: filters.genre });
        }
        if (filters.publicationDate) {
          queryBuilder.andWhere('book.publicationDate = :publicationDate', { publicationDate: filters.publicationDate });
        }
      
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const skip = (page - 1) * limit;
      
        return queryBuilder.skip(skip).take(limit).getMany();
      }

    async findOne(id: number): Promise<Book> {
        return this.booksRepository.findOne({ where: { id } });
    }

    async update(id: number, bookData: Partial<Book>): Promise<Book> {
        const book = await this.booksRepository.findOne({ where: { id } });
        if (!book) {
            return null;
        }
        Object.assign(book, bookData);
        return this.booksRepository.save(book);
    }

    async remove(id: number): Promise<boolean> {
        const result = await this.booksRepository.delete(id);
        return result.affected > 0;
    }
}
