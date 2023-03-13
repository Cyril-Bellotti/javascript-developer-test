export const run = (args, data) => {
    if (args.length != 3) {
        throw new Error(`Argument --filter or --counter missing. Use \`node app.js --filter=<value>\` or \`node app.js --count\`.`)
    }
    const arg = args[2].split('=');
    let result = null
    switch (arg[0]) {
    case '--filter':
        result = filter(data, arg[1])
        break;
    case '--count':
        result = counter(data)
        break;
    default:
        throw new Error('Wrong argument. Type \`node app.js --filter=<value>\` or \`node app.js --count\`');
    }
    return result
}

export const filter = (data, value) => {
    const filteredData = data.filter(country => {
        country.people = country.people?.filter(people => {
            people.animals = people.animals?.filter(animal => { return animal.name?.toLowerCase().includes(value.toLowerCase()) });
            return people.animals?.length > 0
        });
        return country.people?.length > 0;
    })
    return filteredData
}

export const counter = (data) => {
    data.forEach(country => {
        if (!country.name || !country.people) {
            return;
        }
        country.name = `${country.name} [${country.people.length}]`;
        country.people.forEach(person => {
            if (!person.name || !person.animals) {
                return;
            }
            person.name = `${person.name} [${person.animals.length}]`
        });
    });
    return data
}