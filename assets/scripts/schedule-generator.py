from flask import Flask, request, send_file
import random
import textwrap
import matplotlib.pyplot as plt
from matplotlib.table import Table
from io import BytesIO

app = Flask(__name__)


def create_balanced_weekly_schedules_fixed(activities):
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  times = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"]

  total_slots = len(days) * len(times)
  while len(activities) < total_slots:
    activities.extend(random.sample(activities, total_slots - len(activities)))

  random.shuffle(activities)

  schedule_full = {
    day: {time: activities.pop(0) for time in times} for day in days
  }

  schedule_1 = {day: {} for day in days}
  schedule_2 = {day: {} for day in days}

  for day in days:
    for i, time in enumerate(times):
      if (i + random.randint(0, 1)) % 2 == 0:
        schedule_1[day][time] = schedule_full[day][time]
        schedule_2[day][time] = ""
      else:
        schedule_2[day][time] = schedule_full[day][time]
        schedule_1[day][time] = ""

  return schedule_1, schedule_2


def save_schedule_as_image(schedule):
  def schedule_to_table(schedule):
    header = ["Day"] + list(next(iter(schedule.values())).keys())
    table = [header]
    for day, times in schedule.items():
      row = [day] + [times.get(time, "") for time in times]
      table.append(row)
    return table

  def wrap_text(text, width=15):
    return "\n".join(textwrap.wrap(text, width))

  table_data = schedule_to_table(schedule)

  fig, ax = plt.subplots(figsize=(10, 5))
  ax.axis("off")

  table = Table(ax, bbox=[0, 0, 1, 1])
  nrows, ncols = len(table_data), len(table_data[0])
  cell_width, cell_height = 1 / ncols, 1 / nrows

  for i, row in enumerate(table_data):
    for j, cell in enumerate(row):
      wrapped_text = wrap_text(cell, width=15) if isinstance(cell, str) else cell
      table.add_cell(i, j, text=wrapped_text, loc="center", width=cell_width, height=cell_height)

  for i in range(nrows):
    table.add_cell(i, -1, text="", width=0, height=cell_height)

  for j in range(ncols):
    table.add_cell(-1, j, text="", width=cell_width, height=0)

  ax.add_table(table)

  # Save the image to a BytesIO object
  img_io = BytesIO()
  plt.savefig(img_io, format='PNG', bbox_inches="tight", dpi=300)
  img_io.seek(0)
  plt.close()

  return img_io


@app.route('/generate_schedule', methods=['POST'])
def generate_schedule():
  activities = request.json.get('activities', [])
  schedule_1, schedule_2 = create_balanced_weekly_schedules_fixed(activities)

  # Generate image for schedule 1
  img_io = save_schedule_as_image(schedule_1)

  return send_file(img_io, mimetype='image/png', as_attachment=True, download_name="schedule_1.png")


if __name__ == '__main__':
  app.run(debug=True)
