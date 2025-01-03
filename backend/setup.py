from setuptools import setup, find_packages

setup(
    name="bible365",
    packages=find_packages(),
    install_requires=[
        "flask",
        "flask-sqlalchemy",
        "flask-migrate",
        "flask-jwt-extended",
    ],
)
