const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");


app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Wordle", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB bağlantısı başarıyla sağlandı.");
}).catch((error) => {
    console.error("MongoDB bağlantı hatası:", error);
});

const wordSchema = new mongoose.Schema({
    value: String,
});

const Word = mongoose.model("Words", wordSchema);

app.use(express.static(path.join(__dirname)));

// Ana sayfa için
app.get('/words', (req, res) => {
    Word.find({})
        .then((words) => {
            const wordValues = words.map(word => word.value); // Kelimelerin sadece value değerlerini al
            console.log(wordValues);
            res.json(wordValues);
        })
        .catch((error) => {
            console.log('Kelimeler çekilemedi:', error);
            res.status(500).send('Bir hata oluştu');
        });
});

// Sunucuyu başlatın
const port = 5501;
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
