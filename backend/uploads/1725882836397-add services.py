import requests

def add_service(name):
    url = 'http://localhost:3000/api/service/'
    headers = {
        'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
        'Content-Type': 'application/json'
    }
    data = {
        'name': name
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 201:
        print(f'Successfully added: {name}')
    else:
        print(f'Failed to add: {name}, Status code: {response.status_code}, Response: {response.text}')


def main():
    services = [
        "Service Administratif Et Social",
        "Service Generaux",
        "Service Formation",
        "Direction Med.Travail",
        "Direction Financiere",
        "Direction Commerciale",
        "Pont Bascule",
        "Departement Approvisionnement Et Gestion De Stock",
        "Service Approvisionnement",
        "Departement Informatique",
        "Direction Qualite",
        "Direction Production Ens.Ex.",
        "Direction Maintenance Et Methodes",
        "Departement Maintenance",
        "Service Electrique",
        "Service Electronique, Regulation Et Instrumentation",
        "Departement Production Ensachage",
        "Service Fabrication",
        "Service Garage",
        "Service Carrieres",
        "Service Laboratoire",
        "Service Securite",
        "Direction Etudes Realisation"
    ]

    for service in services:
        add_service(service)

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f'An error occurred: {e}')

    input('Press any key to exit...')