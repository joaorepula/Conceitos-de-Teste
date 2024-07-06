import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import Service from '../src/service.js';

describe('#create', () => {
    let _service;
    const MOCKED_HASH_PWD = 'mocked_hash_password';
    const filename = './users.ndjson';

    beforeEach(() => {
        jest.spyOn(crypto, 'createHash').mockReturnValue({
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue(MOCKED_HASH_PWD)
        });

        jest.spyOn(fs, 'appendFile').mockResolvedValue();

        _service = new Service({ filename });
    });

    it('should call appendFile with right params', async () => {
        const input = {
            username: 'user1',
            password: 'passs1'
        };

        const expectedCreatedAt = new Date().toISOString();
        jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(expectedCreatedAt);

        await _service.create(input);

        expect(crypto.createHash).toHaveBeenCalledWith('sha256');
        expect(crypto.createHash().update).toHaveBeenCalledWith(input.password);
        expect(crypto.createHash().digest).toHaveBeenCalledWith('hex');
    

        const expected = JSON.stringify({
            ...input,
            createdAt: expectedCreatedAt,
            password:MOCKED_HASH_PWD
        }).concat('\n')

        expect(fs.appendFile).toHaveBeenCalledWith(
            filename,
            expected
        )
    });
});
