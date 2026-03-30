import { IsNotEmpty, IsString } from "class-validator"

export class CreateColumnDto {
    @IsString({ message: 'Название колонки должно быть строкой' })
    @IsNotEmpty({ message: 'Название колонки не может быть пустым' })
    title: string

    @IsString({ message: 'ID доски должно быть строкой' })
    @IsNotEmpty({ message: 'ID доски не может быть пустым' })
    boardId: string
}