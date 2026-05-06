from django.db import migrations


def create_helwan(apps, schema_editor):
    Institution = apps.get_model("accounts", "Institution")
    Institution.objects.get_or_create(name="Helwan University")


def remove_helwan(apps, schema_editor):
    Institution = apps.get_model("accounts", "Institution")
    Institution.objects.filter(name="Helwan University").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_institution_institutionmember"),
    ]

    operations = [
        migrations.RunPython(create_helwan, remove_helwan),
    ]