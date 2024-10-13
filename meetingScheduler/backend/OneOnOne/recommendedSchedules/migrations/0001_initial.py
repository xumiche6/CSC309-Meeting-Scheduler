# Generated by Django 5.0.3 on 2024-03-11 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('availabilities', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecommendedSchedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('overlapping_time', models.JSONField(blank=True, null=True)),
                ('sender_availability', models.ManyToManyField(related_name='sender_schedule', to='availabilities.availabilities')),
            ],
        ),
    ]
