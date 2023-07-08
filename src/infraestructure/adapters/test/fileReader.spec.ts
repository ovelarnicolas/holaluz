import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { FileReader } from '../fileReader';

describe('CsvReader', () => {
  let fileReader: FileReader;
  const mockReadingFile = { getAll: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileReader],
    })
      .overrideProvider('ReadingFile')
      .useValue(mockReadingFile)
      .compile();

    fileReader = module.get<FileReader>(FileReader);
    jest.clearAllMocks();
  });

  describe('getAllFromCsvFile', () => {
    it('Should call fileReader CSV file', async () => {
      expect(
        await fileReader.getAllFromCsvFile('2016-readings.csv'),
      ).toBeTruthy();
    });
  });

  describe('getAllFromXmlFile', () => {
    it('Should call fileReader XML file', async () => {
      expect(
        await fileReader.getAllFromXmlFile('2016-readings.xml'),
      ).toBeTruthy();
    });
  });

  it(`Should throw an InternalServerErrorException because file.csv did not exists`, async () => {
    expect(fileReader.getAllFromCsvFile('file.csv')).rejects.toEqual(
      new InternalServerErrorException('File not found'),
    );
  });

  it(`Should throw an InternalServerErrorException because file.xml did not exists`, async () => {
    expect(fileReader.getAllFromXmlFile('file.xml')).rejects.toEqual(
      new InternalServerErrorException('File not found'),
    );
  });
});
