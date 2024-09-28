import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new book' })
    @ApiResponse({ status: 201, description: 'The book has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request. Missing required fields.' })
    @UsePipes(new ValidationPipe())
    async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
        return this.booksService.createBook(createBookDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all books' })
    @ApiResponse({ status: 200, description: 'Returns a list of books.' })
    async findAll(
        @Query('author') author?: string,
        @Query('genre') genre?: string,
        @Query('publicationDate') publicationDate?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Promise<Book[]> {
        return this.booksService.findAll({ author, genre, publicationDate, page, limit });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a book by ID' })
    @ApiParam({ name: 'id', description: 'The ID of the book' })
    @ApiResponse({ status: 200, description: 'Returns the book with the specified ID.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async findOne (@Param('id') id: number): Promise<Book> {
        const book = await this.booksService.findOne(id);
        if (!book) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
        return book;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a book' })
    @ApiParam({ name: 'id', description: 'The ID of the book to update' })
    @ApiResponse({ status: 200, description: 'The book has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async update(@Param('id') id: number, @Body() bookData: Partial<Book>): Promise<Book> {
        const updatedBook = await this.booksService.update(id, bookData);
        if (!updatedBook) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
        return updatedBook;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a book' })
    @ApiParam({ name: 'id', description: 'The ID of the book to delete' })
    @ApiResponse({ status: 200, description: 'The book has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Book not found.' })
    async remove(@Param('id') id: number): Promise<void> {
        const result = await this.booksService.remove(id);
        if (!result) {
            throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
        }
    }
}
