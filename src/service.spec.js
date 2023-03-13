import * as Service from './service.js'

describe('Run method', () => {
    let data = []
    const args = [
        '/usr/local/bin/node',
        '/cdp-recruitment/app.js',
    ]
    it('Should throw error because command missing', () => {
        expect(() => Service.run(args, data)).toThrow(`Argument --filter or --counter missing. Use \`node app.js --filter=<value>\` or \`node app.js --count\`.`)
    })
    it('Should throw error because wrong command', () => {
        args.push('--invalid')
        expect(() => Service.run(args, data)).toThrow('Wrong argument. Type \`node app.js --filter=<value>\` or \`node app.js --count\`')
    })
    it('Should return filtered datas', () => {
        args[2] = '--filter=ry'
        data = [
            {
                name: 'country 1',
                people: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    },
                    {
                        name: 'people 2',
                        animals: [
                            {name: 'Zooplankton'},
                            {name: 'Tarantula'},
                            {name: 'Oryx'}
                        ]
                    },
                    {
                        name: 'people 3',
                        animals: []
                    },
                    {
                        name: 'people 4',
                        animals: [
                            {name: 'Kiwa Hirsuta'}
                        ]
                    },
                ]
            },
            {
                name: 'country 2',
                people: []
            }
        ]
        const expectedResult = [
            {
                name: 'country 1',
                people: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                        ]
                    },
                    {
                        name: 'people 2',
                        animals: [
                            {name: 'Oryx'}
                        ]
                    }
                ]
            }
        ]
        const result = Service.run(args, data)
        expect(result).toEqual(expectedResult)
    })
    it('Should return datas with count of child at the end of parent name', () => {
        args[2] = '--count'
        data = [
            {
                name: 'country 1',
                people: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    },
                    {
                        name: 'people 2',
                        animals: [
                            {name: 'Zooplankton'},
                            {name: 'Tarantula'},
                            {name: 'Oryx'}
                        ]
                    },
                    {
                        name: 'people 3',
                        animals: []
                    },
                    {
                        name: 'people 4',
                        animals: [
                            {name: 'Kiwa Hirsuta'}
                        ]
                    },
                ]
            },
            {
                name: 'country 2',
                people: []
            }
        ]
        const expectedResult = [
            {
                name: 'country 1 [4]',
                people: [
                    {
                        name: 'people 1 [2]',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    },
                    {
                        name: 'people 2 [3]',
                        animals: [
                            {name: 'Zooplankton'},
                            {name: 'Tarantula'},
                            {name: 'Oryx'}
                        ]
                    },
                    {
                        name: 'people 3 [0]',
                        animals: []
                    },
                    {
                        name: 'people 4 [1]',
                        animals: [
                            {name: 'Kiwa Hirsuta'}
                        ]
                    },
                ]
            },
            {
                name: 'country 2 [0]',
                people: []
            }
        ]
        const result = Service.run(args, data)
        expect(result).toEqual(expectedResult)
    })
})

describe('Filter method', () => {
    const data = [
        {
            name: 'country 1',
            people: [
                {
                    name: 'people 1',
                    animals: [
                        {name: 'John Dory'},
                        {name: 'Gayal'}
                    ]
                },
                {
                    name: 'people 2',
                    animals: [
                        {name: 'Zooplankton'},
                        {name: 'Tarantula'},
                        {name: 'Oryx'}
                    ]
                },
                {
                    name: 'people 3',
                    animals: []
                },
                {
                    name: 'people 4',
                    animals: [
                        {name: 'Kiwa Hirsuta'}
                    ]
                },
            ]
        },
        {
            name: 'country 2',
            people: []
        }
    ]
    it('Should return all value except country without people and people without animal', () => {
        const expectedResult = [
            {
                name: 'country 1',
                people: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    },
                    {
                        name: 'people 2',
                        animals: [
                            {name: 'Zooplankton'},
                            {name: 'Tarantula'},
                            {name: 'Oryx'}
                        ]
                    },
                    {
                        name: 'people 4',
                        animals: [
                            {name: 'Kiwa Hirsuta'}
                        ]
                    },
                ]
            }
        ]
        const result = Service.filter(data, '');
        expect(result).toEqual(expectedResult)
    })
    it('Should return country with people having animal with the requested value', () => {
        const expectedResult = [
            {
                name: 'country 1',
                people: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                        ]
                    },
                    {
                        name: 'people 2',
                        animals: [
                            {name: 'Oryx'}
                        ]
                    }
                ]
            }
        ]
        const result = Service.filter(data, 'ry');
        expect(result).toEqual(expectedResult)
    })
    it('Should return no value if requested value isn\'t present', () => {
        const expectedResult = []
        const result = Service.filter(data, 'no-value');
        expect(result).toEqual(expectedResult)
    })
    it('Should return only value with matching key', () => {
        const wrongData = [
            {
                wrongName: 'country 1',
                wrongPeople: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            },
            {
                name: 'country 2',
                people: [
                    {
                        wrongName: 'people 1',
                        wrongAnimals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            },
            {
                name: 'country 3',
                people: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            }
        ]
        const expectedResult = [{
            name: 'country 3',
            people: [
                {
                    name: 'people 1',
                    animals: [
                        {name: 'John Dory'},
                        {name: 'Gayal'}
                    ]
                }
            ]
        }]
        const result = Service.filter(wrongData, '');
        expect(result).toEqual(expectedResult)
    })
})

describe('Counter method', () => {
    const data = [
        {
            name: 'country 1',
            people: [
                {
                    name: 'people 1',
                    animals: [
                        {name: 'John Dory'},
                        {name: 'Gayal'}
                    ]
                },
                {
                    name: 'people 2',
                    animals: [
                        {name: 'Zooplankton'},
                        {name: 'Tarantula'},
                        {name: 'Oryx'}
                    ]
                },
                {
                    name: 'people 3',
                    animals: []
                },
                {
                    name: 'people 4',
                    animals: [
                        {name: 'Kiwa Hirsuta'}
                    ]
                },
            ]
        },
        {
            name: 'country 2',
            people: []
        }
    ]
    it('Should add the number of children (peoples and animals) at the end of the name of the parent (country and people)', () => {
        const expectedResult = [
            {
                name: 'country 1 [4]',
                people: [
                    {
                        name: 'people 1 [2]',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    },
                    {
                        name: 'people 2 [3]',
                        animals: [
                            {name: 'Zooplankton'},
                            {name: 'Tarantula'},
                            {name: 'Oryx'}
                        ]
                    },
                    {
                        name: 'people 3 [0]',
                        animals: []
                    },
                    {
                        name: 'people 4 [1]',
                        animals: [
                            {name: 'Kiwa Hirsuta'}
                        ]
                    },
                ]
            },
            {
                name: 'country 2 [0]',
                people: []
            }
        ]
        const result = Service.counter(data);
        expect(result).toEqual(expectedResult)
    })
    it('Should count only value with matching key', () => {
        const wrongData = [
            {
                wrongName: 'country 1',
                wrongPeople: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            },
            {
                name: 'country 2',
                people: [
                    {
                        wrongName: 'people 1',
                        wrongAnimals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            },
            {
                name: 'country 3',
                people: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            }
        ]
        const expectedResult = [
            {
                wrongName: 'country 1',
                wrongPeople: [
                    {
                        name: 'people 1',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            },
            {
                name: 'country 2 [1]',
                people: [
                    {
                        wrongName: 'people 1',
                        wrongAnimals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            },
            {
                name: 'country 3 [1]',
                people: [
                    {
                        name: 'people 1 [2]',
                        animals: [
                            {name: 'John Dory'},
                            {name: 'Gayal'}
                        ]
                    }
                ]
            }
        ]
        const result = Service.counter(wrongData);
        expect(result).toEqual(expectedResult)
    })
})