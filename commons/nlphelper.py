import jieba
import numpy


def wordvectorcos(answer, standardanswer):
    s1 = answer
    s2 = standardanswer

    cut1 = jieba.cut(s1)
    cut2 = jieba.cut(s2)

    list_word1 = (','.join(cut1)).split(',')
    list_word2 = (','.join(cut2)).split(',')
    for word in list_word1:
        if word == ' ':
            list_word1.remove(word)
    for word in list_word2:
        if word == ' ':
            list_word2.remove(word)

    key_word = list(set(list_word1 + list_word2))

    word_vector1 = numpy.zeros(len(key_word))
    word_vector2 = numpy.zeros(len(key_word))

    for i in range(len(key_word)):
        for j in range(len(list_word1)):
            if key_word[i] == list_word1[j]:
                word_vector1[i] += 1
        for k in range(len(list_word2)):
            if key_word[i] == list_word2[k]:
                word_vector2[i] += 1

    res = int(float(numpy.sum(word_vector1 * word_vector2)) / (
            numpy.linalg.norm(word_vector1) * numpy.linalg.norm(word_vector2)) * 100)

    return {'res': res, 'v1': word_vector1.tolist(), 'v2': word_vector2.tolist(), 'keyword': key_word}
