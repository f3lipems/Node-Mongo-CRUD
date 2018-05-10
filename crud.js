const Mongoose = require('mongoose');

(async function () {
    const url = 'mongodb://localhost:27017/testemongoose';
    const nomeBd = 'teste';
    let cliente;
    try {
        cliente = await Mongoose.connect(url);
        console.log('Conectado com sucesso');

        //Definir o esquema dos documentos
        const pessoaEsquema = Mongoose.Schema({
            nome: String,
            idade: Number
        });
        const Pessoa = Mongoose.model('Pessoa', pessoaEsquema);
        //Inserir um documento
        let documento = new Pessoa({ nome: 'John Doe', idade: 22 });
        let resultado = await documento.save();
        console.log(`Inserido: ${resultado.id}`);
    
        //Buscar documentos
        //let consulta = Pessoa.findOne({nome: 'John Doe'});
        let consulta = Pessoa.where('idade').gte(18);
        resultado = await consulta.exec(); //obtem array com todos objetos em memória
        console.log('Busca:');
        console.log(resultado);
        let cursor = Pessoa.where('idade').gte(18).cursor(); //obtem cursor para cada documento
        await cursor.eachAsync((d) => {console.log(d)});
        
        //Alterar um documento
        await Pessoa.update({ nome: 'John Doe' }, { $set: { idade: 33 } }).exec();
        console.log('Alteração com sucesso');
        
        await Pessoa.updateOne({nome:'John Doe'},{$set:{nome:"Felipe"}}).exec();

        //Remover um objeto
        await Pessoa.remove({ nome: 'teste' }).exec();
        console.log('Remoção com sucesso');

        await Pessoa.findByIdAndRemove('5af332fc57e42616df70c2b6').exec();
        console.log('Removido com sucesso');
 
    } catch (erro) {
        console.log(`Erro: ${erro.message}`);
    } finally {
        if (cliente && cliente.connection) {
            cliente.connection.close();
        }
    }
})();