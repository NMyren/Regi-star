#!/usr/bin/env python

from xmljson import yahoo
from xml.etree.ElementTree import fromstring
import requests
from json import dumps
from os import makedirs
from os.path import dirname

parent_path = 'scraping/%s.json'

def get_and_convert(url):
	return yahoo.data(fromstring(requests.get(url).content))

def write(p, content):
	path = parent_path % p
	d = dirname(path)
	makedirs(d, exist_ok=True)
	with open(path, 'w') as f:
		f.write(content)

def handle_sections(semester, subject, course, sections):
	if not isinstance(sections, list):
		sections = [sections]

	for section in sections:
		sec = get_and_convert(section['href'])['{http://rest.cis.illinois.edu}section']

		write('%s/%s/%s/%s' % (semester, subject, course, sec['id']), dumps(sec))


def handle_courses(semester, subject, courses):
	if not isinstance(courses, list):
		courses = [courses]

	for course in courses:
		c = get_and_convert(course['href'])['{http://rest.cis.illinois.edu}course']
		id = c['id'].replace(subject, '').replace(' ', '')
		write('%s/%s/%s' % (semester, subject, id), dumps(c))

		handle_sections(semester, subject, id, c['sections']['section'])

def handle_subjects(semester, subjects):
	if not isinstance(subjects, list):
		subjects = [subjects]

	for subject in subjects:
		sub = get_and_convert(subject['href'])['{http://rest.cis.illinois.edu}subject']
		id = sub['id']
		write('%s/%s' % (semester, id), dumps(sub))

		handle_courses(semester, id, sub['courses']['course'])

def scrape_semester(semester):
	listing = get_and_convert('http://courses.illinois.edu/cisapp/explorer/schedule/2017/%s.xml' % semester)['{http://rest.cis.illinois.edu}term']
	write(semester, dumps(listing))
	handle_subjects(semester, listing['subjects']['subject'])

scrape_semester('spring')