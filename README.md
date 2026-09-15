# FitRecs

FitRecs is a fashion outfit recommendation app. Upload a photo of an outfit and
a computer vision pipeline detects the clothing items, style, and gender
presented in the image; browse and filter a feed of outfits by clothing item,
style, gender, and date.

## Screenshots

**Explore**
![Explore page](docs/screenshots/explore.png)

**Upload**
![Upload page](docs/screenshots/upload.png)

## Tech stack

**Frontend** — `frontend/`
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) for client-side routing and protected routes
- [Axios](https://axios-http.com/) for API requests, with an interceptor that attaches the JWT access token to every request
- [jwt-decode](https://github.com/auth0/jwt-decode) to check token expiry on the client
- A hand-rolled CSS design system (`frontend/src/styles/theme.css`): design tokens for color, spacing, radius, and shadow, plus shared component classes (`.btn`, `.input`, `.card`, etc.) reused across every page for a consistent look

**Backend** — `backend/`
- [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/) for access/refresh token authentication
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers) to allow the Vite dev server to call the API
- SQLite for the database
- [Cloudinary](https://cloudinary.com/) for hosted image storage
- [Roboflow](https://roboflow.com/) computer vision models for clothing item segmentation, style classification, and gender classification (`backend/annotate/tasks.py`)

**Data pipeline** — `scraper/` (not required to run the app; excluded from git because of size)
- A [Selenium](https://www.selenium.dev/) scraper (`chromedriver-mac-arm64`) automatically:
    - Searches through a list of keywords while mixing gender keywords (for example, "Business Casual" + "women" + outfits) on Pinterest.
    - scrolls to load images and downloads 75 images from each search (for a total of 75 images * 2 genders * 19 styles = 2850).
    - Adds randomized delays  to avoid bot detection, 
    - Sorts images into folders by style category (`scraper/images/<style>/`)
- Those labeled images are the training data behind the Roboflow `outfit-styles` classifier, so the style categories in the app (`frontend/src/searchOptions.js`) mirror the scraper's folder names: 90s hip hop, casual, clean, dark academia, downtown, gorpcore, grunge, light academia, old money, opium, preppy, skater, soft, star, streetwear, surfer, vintage, workwear
- 

## Annotation pipeline

When a user uploads a photo (`POST /api/upload/`), `backend/annotate/tasks.py` runs it through three Roboflow models before saving it:

1. **`outfit-styles`** — classifies the overall style (e.g. streetwear, old money)
2. **`gender-detection-irbyv`** — classifies gender presentation
3. **`cs-lab-project`** — segments individual clothing items (shirt, jeans, jacket, etc.), trained on the labeled dataset in `backend/CS-lab-project-2/` with the class list in `backend/annotate/class_colors.json`

The clothing segmentation is drawn as a colored outline over a copy of the image, which is uploaded to Cloudinary as the "annotated" version. The detected style, gender, and clothing annotations are saved on the `Upload` model so the Explore page can filter by them.

## Project structure

```
frontend/   React + Vite single-page app
backend/    Django REST API
  api/          user registration/auth endpoints
  annotate/     image upload, Roboflow annotation pipeline, outfit feed endpoints
scraper/    Selenium/Pinterest scraper used to build the style-classifier training set (local tooling, not deployed)
```

## Getting started

### Prerequisites
- Node.js 18+
- Python 3.11+
- A [Cloudinary](https://cloudinary.com/) account and a [Roboflow](https://roboflow.com/) API key (needed for the upload/annotation pipeline; the explore/login/register pages work without them)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt

cp .env.example .env   # fill in CLOUDINARY_URL, ROBOFLOW_API_KEY, DJANGO_SECRET_KEY

python manage.py migrate
python manage.py runserver
```

The API runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL should point at the backend above
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment variables

| File | Variable | Description |
| --- | --- | --- |
| `backend/.env` | `DJANGO_SECRET_KEY` | Django's secret key. Generate one with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `backend/.env` | `DJANGO_DEBUG` | `True` for local development |
| `backend/.env` | `CLOUDINARY_URL` | Cloudinary connection string, from your Cloudinary dashboard |
| `backend/.env` | `ROBOFLOW_API_KEY` | API key for the Roboflow models used to annotate uploads |
| `frontend/.env` | `VITE_API_URL` | Base URL of the Django API |

None of these `.env` files are committed — copy the corresponding `.env.example` and fill in your own values.
