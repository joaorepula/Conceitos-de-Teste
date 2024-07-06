import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import Service from '../src/service.js'
import exp from 'node:constants'

describe('#Service suite', () => {
    let _service
    const filename = './testfile.ndjson'

    beforeEach(() => {
        _service = new Service({ filename })
    })

    describe('#read', () => {
        it('should return an empty array if the file is empty', async () => {
            jest.spyOn(
                fs,
                fs.readFile.name
            ).mockResolvedValue('')

            const result = await _service.read()
            expect(result).toEqual([])
        })
        it('should return users withou password if file contains users', async () => {
            const dbData = [
                {
                    username: 'user1',
                    password: 'user1',
                    createdAt: new Date().toISOString()
                },
                {
                    username: 'user1',
                    password: 'user1',
                    createdAt: new Date().toISOString()
                }
            ]

            const fileContent = dbData.map(item => JSON.stringify(item).concat('\n')).join('')

            jest.spyOn(
                fs,
                "readFile"
            ).mockResolvedValue(fileContent)

            const result = await _service.read()
            const expected = dbData.map(({password, ...rest}) => ({ ...rest }))
            expect(result).toEqual(expected)
        })
        //!TODO criar um teste usando rejectedValue 
    })
})
