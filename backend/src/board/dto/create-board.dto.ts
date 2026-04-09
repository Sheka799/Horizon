import { IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDto {
    @IsString({ message: 'Название доски должно быть строкой' })
    @IsNotEmpty({ message: 'Название доски обязательное поле для заполнения' })
    title!: string;
}