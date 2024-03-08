import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseModel } from './base/entity.base';
import { BasePaginationDto } from './base/pagination.base';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { FILTER_MAPPER } from './const/filter-mapper.const';

export type ValueHandler<T extends BaseModel> = (result: T[]) => T[];

@Injectable()
export class CommonService {
    constructor() { }


    paginate<T extends BaseModel>(
        dto: BasePaginationDto,
        reposiotry: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
        path: string,
        handler?: ValueHandler<T>
    ) {
        if (dto.page) {
            return this.PagePaginate(
                dto,
                reposiotry,
                overriedFindOptions,
                handler,
            )
        } else {

            return this.cursorPaginate(
                dto,
                reposiotry,
                overriedFindOptions,
                path,
                handler,
            )
        }
    };


    async cursorPaginate<T extends BaseModel>(
        dto: BasePaginationDto,
        reposiotry: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
        path: string,
        handler?: ValueHandler<T>
    ) {

        const findOptions = this.composeWhereAndOrderFilter<T>(dto);

        const result = await reposiotry.find({
            ...findOptions,
            ...overriedFindOptions
        });


        const values = handler ? handler(result) : result;


        const lastItem = values && values.length === dto.take ? values.at(-1) : null;
        const nextURL = lastItem ? new URL(`http://localhost:3000/${path}`) : null;

        if (nextURL) {

            for (const key of Object.keys(dto)) {

                if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {

                    nextURL.searchParams.append(key, dto[key])
                };

            };

            let key = null;

            if (dto.order__createdAt === 'ASC') {
                key = 'where__id__more_than'
            } else if (dto.order__createdAt === 'DESC') {
                key = 'where__id__less_than'
            }

            nextURL.searchParams.append(key, lastItem.id.toString());
        };


        return {
            data: values,
            cursor: {
                after: lastItem?.id.toString() ?? null
            },
            take: dto.take,
            nextURL: nextURL?.toString() ?? null,
        };

    };


    async PagePaginate<T extends BaseModel>(
        dto: BasePaginationDto,
        reposiotry: Repository<T>,
        overriedFindOptions: FindManyOptions<T> = {},
        handler?: ValueHandler<T>
    ) {

        const findOptions = this.composeWhereAndOrderFilter<T>(dto);

        const [options, count] = await reposiotry.findAndCount({
            ...findOptions,
            ...overriedFindOptions,
        });

        return {
            data: options,
            total: count
        };
    };



    parseWhereAndOrderFilter<T extends BaseModel>(key: string, value: any): FindOptionsWhere<T> | FindOptionsOrder<T> {

        let options: FindOptionsWhere<T> | FindOptionsOrder<T> = {};

        const split = key.split('__');

        if (split.length !== 2 && split.length !== 3) {

            throw new BadRequestException('where,order를 split하면 길이가 반드시 2또는 3이어야 합니다.')
        }

        if (split.length === 2) {

            const [_, field] = split;
            options[field] = value;

        } else {

            const [_, field, operator] = split;

            if (operator === 'i_like') {

                options[field] = FILTER_MAPPER[operator](`%${value}%`)
            } else {
                options[field] = FILTER_MAPPER[operator](value);
            }
        }


        return options;

    };



    composeWhereAndOrderFilter<T extends BaseModel>(dto: BasePaginationDto): FindManyOptions<T> {

        let where: FindOptionsWhere<T> = {};
        let order: FindOptionsOrder<T> = {};


        for (const [key, value] of Object.entries(dto)) {

            if (dto[key]) {

                if (key.startsWith('where__')) {

                    where = {
                        ...where,
                        ...this.parseWhereAndOrderFilter(key, value)
                    };
                } else if (key.startsWith('order__')) {

                    order = {
                        ...order,
                        ...this.parseWhereAndOrderFilter(key, value)
                    };
                };
            };
        };


        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page - 1) : null
        };

    };
}
