def test_get_books(client, auth_token):
    response = client.get('/api/bible/books',
                          headers={'Authorization': f'Bearer {auth_token}'})
    assert response.status_code == 200


def test_get_chapters(client, auth_token):
    response = client.get('/api/bible/chapters/1',
                          headers={'Authorization': f'Bearer {auth_token}'})
    assert response.status_code == 200
    chapters = response.json
    assert len(chapters) > 0
    assert all(key in chapters[0] for key in ['id', 'number'])
