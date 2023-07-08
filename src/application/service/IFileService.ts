import Client from '../../domain/client';

export interface IFileService {
  readFile(fileName: string): Promise<Client[]>;
}
