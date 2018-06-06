import { TestBed, inject } from '@angular/core/testing';

import { ExpertService } from './expert.service';

describe('ExpertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpertService]
    });
  });

  it('should be created', inject([ExpertService], (service: ExpertService) => {
    expect(service).toBeTruthy();
  }));
});
