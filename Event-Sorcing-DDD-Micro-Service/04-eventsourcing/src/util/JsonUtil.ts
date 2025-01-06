import { Injectable } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';

@Injectable()
export class JsonUtilService {
  private constructor() {}

  static toJson<T>(target: T): string {
    try {
      return JSON.stringify(target);
    } catch (error) {
      console.error('Error serializing object to JSON:', error);
      return '';
    }
  }

  static fromJson<T>(json: string, clazz: ClassConstructor<T>): T | null {
    try {
      const plainObject = JSON.parse(json);
      return plainToInstance(clazz, plainObject);
    } catch (error) {
      console.error('Error deserializing JSON to object:', error);
      return null;
    }
  }

  static fromJsonList<T>(json: string, clazz: ClassConstructor<T>): T[] {
    try {
      const plainArray = JSON.parse(json);
      return plainToInstance(clazz, plainArray) as T[];
    } catch (error) {
      console.error('Error deserializing JSON to list:', error);
      return [];
    }
  }

  static fromJsonSet<T>(json: string, clazz: ClassConstructor<T>): Set<T> {
    try {
      const plainArray = JSON.parse(json);
      const instances = plainToInstance(clazz, plainArray);
      return new Set(instances as T[]) as Set<T>;
    } catch (error) {
      console.error('Error deserializing JSON to set:', error);
      return new Set<T>();
    }
  }
}
