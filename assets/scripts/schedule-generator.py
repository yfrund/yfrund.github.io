import random
import textwrap
from flask import Flask, request, render_template, send_file
from io import BytesIO
import matplotlib.pyplot as plt
from matplotlib.table import Table

app = Flask(__name__)


# Helper function to create balanced schedules
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

  # Populate the schedules with alternating empty slots
  for day in days:
    for i, time in enumerate(times):
      if (i + random.randint(0, 1)) % 2 == 0:
        schedule_1[day][time] = schedule_full[day][time]
        schedule_2[day][time] = ""
      else:
        schedule_2[day][time] = schedule_full[day][time]
        schedule_1[day][time] = ""

  return schedule_1, schedule_2


# Helper function to convert schedule to table
def schedule_to_table(schedule):
  header = ["Day"] + list(next(iter(schedule.values())).keys())
  table = [header]
  for day, times in schedule.items():
    row = [day] + [times.get(time, "") for time in times]
    table.append(row)
  return table


# Function to wrap text for image fitting
def wrap_text(text, width=15):
  return "\n".join(textwrap.wrap(text, width))


# Function to save the schedule as an image
def save_schedule_as_image(schedule):
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


# Flask route to render the HTML and handle requests
@app.route("/", methods=["GET", "POST"])
def index():
  if request.method == "POST":
    # Get activities from the input field
    activities_input = request.form["activities"]
    activities = activities_input.splitlines()  # Split input by line

    # Generate the schedules
    schedule_1, schedule_2 = create_balanced_weekly_schedules_fixed(activities)

    # Generate images for both schedules
    img_io_1 = save_schedule_as_image(schedule_1)
    img_io_2 = save_schedule_as_image(schedule_2)

    # Send the image for schedule_1 as a response for download
    return send_file(img_io_1, mimetype="image/png", as_attachment=True, download_name="schedule_1.png")

  return render_template("index.html")


if __name__ == "__main__":
  app.run(debug=True)
