# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-08-01 19:33
from __future__ import unicode_literals

from django.db import migrations, models
from seqr.models import Individual as SeqrIndividual


def reset_invalid_case_review_status(apps, schema_editor):
    # We get the model from the versioned app registry;
    # if we directly import it, it'll be the wrong version
    # see https://docs.djangoproject.com/en/1.11/ref/migration-operations/#django.db.migrations.operations.RunPython
    Individual = apps.get_model("seqr", "Individual")
    db_alias = schema_editor.connection.alias
    for i in Individual.objects.using(db_alias).exclude(case_review_status__in=SeqrIndividual.CASE_REVIEW_STATUS_LOOKUP.keys()):
        i.case_review_status = 'U' if i.case_review_status else 'I'
        i.save()


class Migration(migrations.Migration):

    dependencies = [
        ('seqr', '0044_familyanalysedby'),
    ]

    operations = [
        migrations.RunPython(reset_invalid_case_review_status, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='individual',
            name='case_review_status',
            field=models.CharField(choices=[(b'I', b'In Review'), (b'U', b'Uncertain'), (b'A', b'Accepted'), (b'R', b'Not Accepted'), (b'Q', b'More Info Needed'), (b'P', b'Pending Results and Records'), (b'W', b'Waitlist')], default=b'I', max_length=2),
        ),
    ]
